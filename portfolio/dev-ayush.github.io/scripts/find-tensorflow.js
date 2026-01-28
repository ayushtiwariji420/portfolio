const { skillOperations } = require('./src/lib/database');

async function findTensorFlow() {
  try {
    const allSkills = await skillOperations.getAll();
    const tfSkills = allSkills.filter(skill => skill.name.toLowerCase().includes('tensorflow'));

    console.log('TensorFlow skills found:', tfSkills.length);
    tfSkills.forEach(skill => console.log('- ID:', skill.id, 'Name:', skill.name));
  } catch (error) {
    console.error('Error:', error);
  }
}

findTensorFlow();