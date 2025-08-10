const fs = require("fs");
const { spawn } = require("child_process");
const path = require("path");
const { v4: uuid } = require("uuid");

const EXTENSIONS = {
  cpp: "cpp",
  python: "py",
  java: "java",
  javascript: "js",
  c: "c"
};

exports.executeCode = (language, code, input = "") => {
  return new Promise((resolve) => {
    try {
      const jobId = uuid();
      const ext = EXTENSIONS[language];
      // Force Main.java for Java so class name matches
      const fileName = language === "java" ? "Main.java" : `${jobId}.${ext}`;
      const filePath = path.join(__dirname, "../temp", fileName);

      // Ensure temp folder exists
      if (!fs.existsSync(path.join(__dirname, "../temp"))) {
        fs.mkdirSync(path.join(__dirname, "../temp"));
      }

      fs.writeFileSync(filePath, code);

      const startTime = Date.now();
      let cmd, args;

      switch (language) {
        case "cpp":
          cmd = "g++";
          args = [filePath, "-o", `${filePath}.out`];
          break;
        case "c":
          cmd = "gcc";
          args = [filePath, "-o", `${filePath}.out`];
          break;
        case "python":
          cmd = "python3";
          args = [filePath];
          break;
        case "java":
          cmd = "javac";
          args = [filePath];
          break;
        case "javascript":
          cmd = "node";
          args = [filePath];
          break;
        default:
          return resolve({ output: "", error: "Unsupported language", execTime: 0 });
      }

      // Compile step for C, C++, Java
      if (["cpp", "c", "java"].includes(language)) {
        const compile = spawn(cmd, args);
        let compileError = "";

        compile.stderr.on("data", (data) => compileError += data.toString());

        compile.on("close", (codeStatus) => {
          if (codeStatus !== 0) {
            cleanup();
            return resolve({ output: "", error: compileError, execTime: Date.now() - startTime });
          }

          // Run executable / java class
          if (language === "java") {
            runProcess("java", ["-cp", path.join(__dirname, "../temp"), "Main"]);
          } else {
            runProcess(`${filePath}.out`, []);
          }
        });
      } else {
        runProcess(cmd, args);
      }

      function runProcess(command, argumentsList) {
        const process = spawn(command, argumentsList);
        let output = "";
        let errorOutput = "";

        if (input) {
          process.stdin.write(input);
        }
        process.stdin.end();

        process.stdout.on("data", (data) => output += data.toString());
        process.stderr.on("data", (data) => errorOutput += data.toString());

        process.on("close", () => {
          cleanup();
          const execTime = Date.now() - startTime;
          if (errorOutput) {
            return resolve({ output: "", error: errorOutput, execTime });
          }
          resolve({ output, error: null, execTime });
        });
      }

      function cleanup() {
        fs.unlink(filePath, () => {});
        if (["cpp", "c"].includes(language)) fs.unlink(`${filePath}.out`, () => {});
        if (language === "java") {
          fs.unlink(path.join(__dirname, "../temp", "Main.class"), () => {});
        }
      }
    } catch (err) {
      return resolve({ output: "", error: `Execution service error: ${err.message}`, execTime: 0 });
    }
  });
};
