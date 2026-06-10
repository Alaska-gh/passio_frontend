const fs = require('fs');

function generate(templatePath, outputPath) {
  let file = fs.readFileSync(templatePath, 'utf8');

  file = file
    .replace('__PRODUCTION__', process.env.PRODUCTION)
    .replace('__API_KEY__', process.env.API_KEY)
    .replace('__AUTH_DOMAIN__', process.env.AUTH_DOMAIN)
    .replace('__PROJECT_ID__', process.env.PROJECT_ID)
    .replace('__STORAGE_BUCKET__', process.env.STORAGE_BUCKET)
    .replace('__MESSAGE_SENDER_ID__', process.env.MESSAGE_SENDER_ID)
    .replace('__APP_ID__', process.env.APP_ID)
    .replace('__PUBLIC_KEY__', process.env.PUBLIC_KEY)
    .replace('__BASE_URL__', process.env.BASE_URL);

  fs.writeFileSync(outputPath, file);
}

generate(
  './src/environments/environment.template.ts',
  './src/environments/environment.ts'
);