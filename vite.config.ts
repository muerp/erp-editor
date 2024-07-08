import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import macrosPlugin from "vite-plugin-babel-macros";
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import stringHash from "string-hash";
export default defineConfig({
    // optimizeDeps: {
    //     include: ['esm-dep > cjs-dep']
    // },
    plugins: [
        macrosPlugin(),
        react(),
        createSvgIconsPlugin({
            iconDirs: [path.resolve(process.cwd(), "src/assets/icons")], // icon存放的目录
            symbolId: "icon-[name]", // symbol的id
            inject: "body-last", // 插入的位置
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    base: "./",
    css: {
        modules: {
          generateScopedName: (name, filename, css) => {
            const f = filename.split("?")[0].split(".")[0];
            const file = path.basename(f);
            const hash = stringHash(css).toString(36).substr(0, 5);
            return `${file}_${name}_${hash}`;
          },
        },
    },
    server: {
        host: '0.0.0.0',
        port: 8088,
        open: true,
        // proxy: {
        //     '/api': {
        //         target: '后端接口域名',
        //         changeOrigin: true,
        //         rewrite: (path) => path.replace(/^\/api/, ''),
        //     }
        // }
    },

})