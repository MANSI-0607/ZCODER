const { executeCode } = require("../utils/codeExecutor");

exports.runCode = async (req, res) => {
  const { language, code, input } = req.body;

  if (!language || !code) {
    return res.status(400).json({ success: false, output: "Language and code are required" });
  }

  try {
    const { output, error, execTime } = await executeCode(language, code, input);

    // Always send a 200 response — even on error
    return res.status(200).json({
      success: !error,
      output: error || output,
      executionTime: execTime || null
    });
  } catch (err) {
    console.error("Fatal execution error:", err);
    return res.status(200).json({
      success: false,
      output: `Internal error: ${err.message}`,
      executionTime: null
    });
  }
};
