export default {
  plugins: {
    autoprefixer: {},
    'postcss-pxtorem': {
      rootValue: 37.5,      // 设计稿宽度为 375 时，1rem = 10px（推荐）
      propList: ['*'],      // 所有属性都启用 rem 转换
      exclude: /node_modules/i,
    },
  },
};
