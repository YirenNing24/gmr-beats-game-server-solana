import ollama from 'ollama'


const response = await ollama.chat({
    model: 'mistral',
    messages: [{ role: 'user', content: 'Who is the sexiest in kpop?' }],
  })
  console.log(response.message.content)
ollama.create