
/**
 * Helper function to handle async states for any thunk with an optional onSuccess callback.
 *
 * If a callback is provided, it will be called in the fulfilled branch and
 * is responsible for updating the state. Otherwise, the state is updated
 * automatically by assigning action.payload to state[key].
 *
 * @param {object} builder - The builder object from extraReducers.
 * @param {Function} thunk - The async thunk action.
 * @param {string} key - The key in state to update.
 * @param {Function} [onSuccess] - Optional callback that receives (state, action) on a successful API call.
 */
export const handleAsyncActions = (builder, thunk, key, onSuccess) => {
    builder
        .addCase(thunk.pending, (state) => {
            state.loading[key] = true;
            state.error[key] = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
            state.loading[key] = false;
            // If onSuccess callback exists, let it handle the state update.
            // Otherwise, update the state automatically.
            if (onSuccess && typeof onSuccess === 'function') {
                onSuccess(state, action);
            } else {
                state[key] = action.payload && typeof action.payload === 'object' ? action.payload : null;
            }
        })
        .addCase(thunk.rejected, (state, action) => {
            state.loading[key] = false;
            state.error[key] = action.payload;
        });
};
