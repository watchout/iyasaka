import { spawn } from 'child_process';
import { writeFileSync, existsSync, mkdirSync, watch } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const nuxtDir = join(projectRoot, '.nuxt');

const tsconfigApp = {
  extends: './tsconfig.json',
  compilerOptions: {
    composite: true,
    types: []
  },
  include: ['../**/*', '../.nuxt/**/*'],
  exclude: ['../node_modules', '../dist']
};

const tsconfigNode = {
  extends: './tsconfig.json',
  compilerOptions: {
    composite: true,
    module: 'ESNext',
    moduleResolution: 'Bundler',
    types: ['node']
  },
  include: ['../nuxt.config.ts', '../tailwind.config.js']
};

const tsconfigShared = {
  extends: './tsconfig.json',
  compilerOptions: {
    composite: true,
    types: []
  },
  include: ['../**/*'],
  exclude: ['../node_modules', '../dist', '../.nuxt']
};

function createTsconfigs() {
  if (!existsSync(nuxtDir)) {
    mkdirSync(nuxtDir, { recursive: true });
  }
  
  const appPath = join(nuxtDir, 'tsconfig.app.json');
  const nodePath = join(nuxtDir, 'tsconfig.node.json');
  const sharedPath = join(nuxtDir, 'tsconfig.shared.json');
  
  if (!existsSync(appPath)) {
    writeFileSync(appPath, JSON.stringify(tsconfigApp, null, 2));
    console.log('✓ Created tsconfig.app.json');
  }
  
  if (!existsSync(nodePath)) {
    writeFileSync(nodePath, JSON.stringify(tsconfigNode, null, 2));
    console.log('✓ Created tsconfig.node.json');
  }
  
  if (!existsSync(sharedPath)) {
    writeFileSync(sharedPath, JSON.stringify(tsconfigShared, null, 2));
    console.log('✓ Created tsconfig.shared.json');
  }
}

// Start watching
let watcher;
if (existsSync(nuxtDir)) {
  watcher = watch(nuxtDir, (eventType, filename) => {
    if (filename === 'tsconfig.app.json' || filename === 'tsconfig.node.json' || filename === 'tsconfig.shared.json') {
      setTimeout(createTsconfigs, 10);
    }
  });
}

// Prepare
console.log('Running nuxt prepare...');
const prepare = spawn('npx', ['nuxi', 'prepare'], { 
  cwd: projectRoot, 
  stdio: 'inherit',
  shell: true
});

prepare.on('close', (code) => {
  if (code !== 0) {
    console.error('Prepare failed');
    process.exit(code);
  }
  
  // Create tsconfigs after prepare
  createTsconfigs();
  
  // Start continuous creation during build
  const interval = setInterval(createTsconfigs, 100);
  
  // Start build
  console.log('Starting build...');
  const build = spawn('npx', ['nuxi', 'build'], {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: true
  });
  
  build.on('close', (buildCode) => {
    clearInterval(interval);
    if (watcher) watcher.close();
    process.exit(buildCode);
  });
});

