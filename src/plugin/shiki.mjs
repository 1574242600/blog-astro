export const deleteAstroTransformer = {
    preprocess(_, config) {
        config.transformers = config.transformers.slice(1)
    }
}