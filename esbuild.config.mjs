import esbuild from "esbuild";
import process from "process";
import fs from "fs";
import path from "path";

const banner =
    `/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source visit the plugins github repository
*/
`;

const prod = (process.argv[2] === 'production');

const doCopyFiles = function () {
    const srcPath = "./";
    const destPath = "./release";
    if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath);
        console.log(`Creating directory ${destPath}.`);
    } else {
        console.log(`Directory ${destPath} already exists.`);
    }
    const copyFile = function (fn) {
        console.log(`Copying file ${fn}`);
        fs.copyFileSync(path.join(srcPath, fn), path.join(destPath, fn));;
    }
    copyFile("main.js");
    copyFile("styles.css");
    copyFile("manifest.json");
}

esbuild.build({
    banner: {
        js: banner,
    },
    entryPoints: ['src//main.ts'],
    bundle: true,
    external: ['obsidian'],
    format: 'cjs',
    watch: {
        onRebuild(error, result) {
            console.log('rebuilding');
            if (error) console.error('watch build failed:', error);
            else {
                console.log('watch build succeeded:', result);
                doCopyFiles();
            }
        }
    },
    target: 'es2016',
    logLevel: "info",
    sourcemap: prod ? false : 'inline',
    treeShaking: true,
    outfile: 'main.js',
}).catch(() => process.exit(1)).then(() => {
    console.log("Build done pooo")
}).then(() => {
    doCopyFiles();
    process.exit(0); /* Without this process seems to hang after copying files */
});
