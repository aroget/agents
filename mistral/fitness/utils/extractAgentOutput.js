export const extractAgentOutput = (response) => {
  const assistantOutput = response.outputs.find(
    (output) => output.role === "assistant",
  );
  return assistantOutput ? assistantOutput.content : null;
};
