import OpenAI from 'openai';

// const openai = new OpenAI({
//   apiKey:

// });

export async function callGenAI(text: string) {
  console.log('Hey I am with callGenAi');
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: `This is a resume:\n\n${text}\n\nGive a summary and extract job roles and skills.`,
      },
    ],
    model: 'gpt-3.5-turbo',
  });

  return chatCompletion.choices[0].message.content;
}
