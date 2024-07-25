import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./App.css";

export const ACTIONS = {
  ADD_DIGIT: "ADD_DIGIT",
  CHOOSE_OPERATION: "CHOOSE_OPERATION",
  CLEAR: "CLEAR",
  DELETE_DIGIT: "DELETE_DIGIT",
  EVALUATE: "EVALUATE",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (
        payload.operation == "-" &&
        state.operation != null &&
        state.currentOperand == 0
      ) {
        return {
          ...state,
          negative: "-",
        };
      }

      if (
        state.negative != "" &&
        payload.operation != "-" &&
        state.currentOperand == 0
      ) {
        return {
          ...state,
          negative: "",
          operation: payload.operation,
        };
      }
      if (state.currentOperand == 0 && state.previousOperand == null) {
        return state;
      }
      if (state.currentOperand == 0) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          previousOperand: state.currentOperand,
          currentOperand: 0,
          operation: payload.operation,
        };
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        currentOperand: 0,
        operation: payload.operation,
      };
    case ACTIONS.CLEAR:
      return defaultState;
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: 0,
        };
      }
      if (state.negative) {
        return {
          ...state,
          negative: false,
          operation: state.operation,
        };
      }
      if (state.currentOperand == 0) return state;
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: 0,
        };
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == 0 ||
        state.previousOperand == null
      ) {
        return state;
      }
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        negative: "",
        currentOperand: evaluate(state),
      };
  }
}

function evaluate({ currentOperand, previousOperand, operation, negative }) {
  const prev = parseFloat(previousOperand);
  const current =
    negative != ""
      ? parseFloat(currentOperand) * -1
      : parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return "";
  let total = "";
  switch (operation) {
    case "+":
      total = prev + current;
      break;
    case "-":
      total = prev - current;
      break;
    case "*":
      total = prev * current;
      break;
    case "÷":
      total = prev / current;
      break;
  }
  return total;
}

const defaultState = {
  currentOperand: 0,
  previousOperand: null,
  operation: null,
  negative: "",
};

function App() {
  const [{ currentOperand, previousOperand, operation, negative }, dispatch] =
    useReducer(reducer, defaultState);

  return (
    <div className="calculator">
      <div id="display" className="output">
        <div className="previous-operand">
          {previousOperand}
          {operation}
          {negative}
        </div>
        <div className="current-operand">{currentOperand}</div>
      </div>
      <button
        id="clear"
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button
        id="delete"
        onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}
      >
        DEL
      </button>
      <OperationButton id="divide" operation="÷" dispatch={dispatch} />
      <DigitButton id="one" digit="1" dispatch={dispatch} />
      <DigitButton id="two" digit="2" dispatch={dispatch} />
      <DigitButton id="three" digit="3" dispatch={dispatch} />
      <OperationButton id="multiply" operation="*" dispatch={dispatch} />
      <DigitButton id="four" digit="4" dispatch={dispatch} />
      <DigitButton id="five" digit="5" dispatch={dispatch} />
      <DigitButton id="six" digit="6" dispatch={dispatch} />
      <OperationButton id="add" operation="+" dispatch={dispatch} />
      <DigitButton id="seven" digit="7" dispatch={dispatch} />
      <DigitButton id="eight" digit="8" dispatch={dispatch} />
      <DigitButton id="nine" digit="9" dispatch={dispatch} />
      <OperationButton id="subtract" operation="-" dispatch={dispatch} />
      <DigitButton id="decimal" digit="." dispatch={dispatch} />
      <DigitButton id="zero" digit="0" dispatch={dispatch} />
      <button
        id="equals"
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}

export default App;
