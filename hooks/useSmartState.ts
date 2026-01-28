import { useState, useCallback } from 'react';

interface HistoryState<T> {
    past: T[];
    present: T;
    future: T[];
}

export const useSmartState = <T>(initialState: T, key?: string) => {
    // Load from localStorage if key is provided
    const loadInitialState = () => {
        if (!key) return initialState;
        try {
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : initialState;
        } catch (e) {
            console.error("Failed to load state from localStorage", e);
            return initialState;
        }
    };

    const [state, setState] = useState<HistoryState<T>>({
        past: [],
        present: loadInitialState(),
        future: [],
    });

    const canUndo = state.past.length > 0;
    const canRedo = state.future.length > 0;

    const undo = useCallback(() => {
        setState((currentState) => {
            if (currentState.past.length === 0) {
                return currentState;
            }
            const previous = currentState.past[currentState.past.length - 1];
            const newPast = currentState.past.slice(0, currentState.past.length - 1);

            if (key) localStorage.setItem(key, JSON.stringify(previous)); // Sync

            return {
                past: newPast,
                present: previous,
                future: [currentState.present, ...currentState.future],
            };
        });
    }, [key]);

    const redo = useCallback(() => {
        setState((currentState) => {
            if (currentState.future.length === 0) {
                return currentState;
            }
            const next = currentState.future[0];
            const newFuture = currentState.future.slice(1);

            if (key) localStorage.setItem(key, JSON.stringify(next)); // Sync

            return {
                past: [...currentState.past, currentState.present],
                present: next,
                future: newFuture,
            };
        });
    }, [key]);

    const set = useCallback((newStateOrFn: T | ((prev: T) => T)) => {
        setState((currentState) => {
            const newState = typeof newStateOrFn === 'function'
                ? (newStateOrFn as (prev: T) => T)(currentState.present)
                : newStateOrFn;

            // Don't update if the state is the same
            if (JSON.stringify(newState) === JSON.stringify(currentState.present)) {
                return currentState;
            }

            if (key) localStorage.setItem(key, JSON.stringify(newState)); // Sync

            return {
                past: [...currentState.past, currentState.present],
                present: newState,
                future: [],
            };
        });
    }, [key]);

    const reset = useCallback(() => {
        if (key) localStorage.removeItem(key);
        setState({
            past: [],
            present: initialState,
            future: [],
        });
    }, [initialState, key]);

    return {
        state: state.present,
        set,
        undo,
        redo,
        reset,
        canUndo,
        canRedo,
    };
};
