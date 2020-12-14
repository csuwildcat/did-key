
const fs = require('fs-extra');
const gulp = require('gulp');
const run = require('gulp-run');
const bump = require('gulp-bump');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const mergeStreams = require('merge-stream');

async function bumpVersion(){
  return gulp.src('./package.json')
          .pipe(bump())
          .pipe(gulp.dest('./'));
}

gulp.task('bump', bumpVersion);


const compileLocation = 'did-key/utils';
const modules = [
  {
    output: 'ipfs',
    location: 'node_modules/ipfs/dist/index.min.js'
  },
  {
    output: 'nacl',
    location: 'node_modules/tweetnacl/nacl-fast.js'
  },
  {
    output: 'base58',
    location: 'node_modules/micro-base58/index.js'
  }
];

async function compile(){
  await fs.ensureDir(compileLocation);
  return new Promise(resolve => {
    mergeStreams(...modules.map(m => {
      return gulp.src(m.location)
                 .pipe(terser())
                 .pipe(concat(m.output + '.js'))
                 .pipe(gulp.dest(compileLocation))
    })).on('finish', function() {
      resolve();
    })
  });
}

gulp.task('compile', compile);