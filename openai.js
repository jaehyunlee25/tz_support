const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);
main();
async function main() {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "nodejs code for openai",
    max_tokens: 17,
  });
  console.log(response.data);
  response.data.choices.forEach((ob) => {
    console.log(ob.text);
  });
}
const t = setInterval(() => {}, 1000);
/*
const openai = require("openai");
openai.apiKey = "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";
const param = {
  model: "text-davinci-002",
  prompt: "Hello world",
  n: 1,
  temperature: 0.5,
};
openai.completions.create(param, (err, resp) => {
  if (err) console.log(err);
  else console.log(resp);
});
*/
