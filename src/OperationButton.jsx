import { ACTIONS } from "./App";

export default function OperationButton({ id, dispatch, operation }) {
  return (
    <button
      id={id}
      onClick={() =>
        dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation } })
      }
    >
      {operation}
    </button>
  );
}
