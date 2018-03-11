module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-clean')

    grunt.initConfig({
        ts: {
            default: {
                // src: ['src/**/*.ts'],
                // dest: 'bin/',
                // options: {
                //     // rootDir: 'src',
                //     // sourceMap: true,
                //     // module: 'commonjs',
                //     // target: 'es2015',
                //     // experimentalDecorators: true,
                // },
                tsconfig: {
                    tsconfig: "./src/tsconfig.json", // このファイルの中でコンパイル対象のファイル群や `outDir` 指定を行う
                    passThrough: true
                }
            }
        },
        clean: {
            bin: {
                src: ['bin']
            }
        }
    });
}