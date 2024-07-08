const requireAll = (requireContext: any) => {
    return requireContext.keys().map(requireContext)
};
const svgs = require.context("./svg", false, /\.svg$/);

requireAll(svgs);

export {

}