import { defineConfig } from 'vite'
import path from 'path'
import stringHash from 'string-hash'
import react from '@vitejs/plugin-react'
import macrosPlugin from "vite-plugin-babel-macros";
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
export default defineConfig({
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './src') }
    ]
  },

  plugins: [
    macrosPlugin(),
    react(),
    createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons")], // icon存放的目录
        symbolId: "icon-[name]", // symbol的id
        inject: "body-last", // 插入的位置
    })
  ],
  base: "./",
  build: {
    minify: false,
    sourcemap: false,
    lib: {
      entry: path.resolve(__dirname, './src/libs/index.ts'),
      name: 'erp-editor',
      formats: ['es']
    },
    rollupOptions: {
      // 请确保外部化那些你的库中不需要的依赖
      external: [
        'react',
        'react-dom'
      ],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          react: 'React',
          'react-dom': 'react-dom'
        }
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        javascriptEnabled: true,
      },
    },
    modules: {
      generateScopedName: (name, filename, css) => {
        const f = filename.split('?')[0].split('.')[0]
        const file = path.basename(f)
        const hash = stringHash(css).toString(36).substr(0, 5);
        return `${file}_${name}_${hash}`
      }
    }
  }
})
