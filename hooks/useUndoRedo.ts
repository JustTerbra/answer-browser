import { useReducer, useCallback } from 'react';

// --- Action Types ---
const UNDO = 'UNDO';
const REDO = 'REDO';
const SET = 'SET';
const RESET = 'RESET';

// --- State and Action Definitions ---
type State<T> = {
  past: T[];
  present: T;
  future: T[];
};

type Action<T> =
  | { type: typeof UNDO }
  | { type: typeof REDO }
  | { type: typeof SET; newPresent: T }
  | { type: typeof RESET; initialState: T };

// --- Reducer Function ---
const undoReducer = <T>(state: State<T>, action: Action<T>): State<T> => {
  const { past, present, future } = state;

  switch (action.type) {
    case UNDO: {
      if (past.length === 0) return state;
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [present, ...future],
      };
    }
    case REDO: {
      if (future.length === 0) return state;
      const next = future[0];
      const newFuture = future.slice(1);
      return {
        past: [...past, present],
        present: next,
        future: newFuture,
      };
    }
    case SET: {
      const { newPresent } = action;
      if (newPresent === present) return state;
      return {
        past: [...past, present],
        present: newPresent,
        future: [],
      };
    }
    case RESET: {
      return {
        past: [],
        present: action.initialState,
        future: [],
      };
    }
    default: {
      return state;
    }
  }
};

// --- Custom Hook ---
export const useUndoRedo = <T>(initialState: T) => {
  const [state, dispatch] = useReducer(undoReducer, {
    past: [],
    present: initialState,
    future: [],
  });

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const undo = useCallback(() => {
    if (canUndo) {
      dispatch({ type: UNDO });
    }
  }, [canUndo]);

  const redo = useCallback(() => {
    if (canRedo) {
      dispatch({ type: REDO });
    }
  }, [canRedo]);

  const set = useCallback((newPresent: T) => {
    dispatch({ type: SET, newPresent });
  }, []);

  const reset = useCallback((newInitialState: T) => {
    dispatch({ type: RESET, initialState: newInitialState });
  }, []);

  return {
    state: state.present,
    set,
    reset,
    undo,
    redo,
    canUndo,
    canRedo,
  };
};
