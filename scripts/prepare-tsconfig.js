import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const nuxtDir = join(projectRoot, '.nuxt');

// Ensure .nuxt directory exists and Nuxt is prepared
if (!existsSync(nuxtDir)) {
  console.log('Running nuxt prepare...');
  execSync('npx nuxi prepare', { cwd: projectRoot, stdio: 'inherit' });
}

// Wait a moment for file system to settle
await new Promise(resolve => setTimeout(resolve, 100));

// Create tsconfig.app.json
const tsconfigApp = {
  extends: './tsconfig.json',
  compilerOptions: {
    composite: true,
    types: []
  },
  include: [
    '../**/*',
    '../.nuxt/**/*'
  ],
  exclude: [
    '../node_modules',
    '../dist'
  ]
};

// Create tsconfig.node.json
const tsconfigNode = {
  extends: './tsconfig.json',
  compilerOptions: {
    composite: true,
    module: 'ESNext',
    moduleResolution: 'Bundler',
    types: ['node']
  },
  include: [
    '../nuxt.config.ts',
    '../tailwind.config.js'
  ]
};

// Write files
const appPath = join(nuxtDir, 'tsconfig.app.json');
const nodePath = join(nuxtDir, 'tsconfig.node.json');

try {
  writeFileSync(appPath, JSON.stringify(tsconfigApp, null, 2));
  console.log('✓ Created', appPath);
  
  writeFileSync(nodePath, JSON.stringify(tsconfigNode, null, 2));
  console.log('✓ Created', nodePath);
} catch (error) {
  console.error('Failed to create tsconfig files:', error);
  process.exit(1);
}

