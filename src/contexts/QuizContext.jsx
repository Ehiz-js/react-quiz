import { createContext, useContext, useReducer } from "react";

const QuizContext = createContext();
const SECS_PER_QUESTION = 10;

const initialState = {
	questions: [],
	//'loading', "error", 'ready', 'active', 'finished'
	status: "loading",
	index: 0,
	answer: null,
	points: 0,
	highscore: 0,
	secondsRemaining: 10,
};

function reducer(state, action) {
	switch (action.type) {
		case "dataReceived":
			return {
				...state,
				status: "ready",
				questions: action.payload,
			};
		case "dataFailed":
			return {
				...state,
				status: "error",
			};
		case "start":
			return {
				...state,
				status: "active",
				secondsRemaining: state.questions.length * SECS_PER_QUESTION,
			};
		case "newAnswer":
			const question = state.questions.at(state.index);

			return {
				...state,
				answer: action.payload,
				points:
					action.payload === question.correctOption
						? state.points + question.points
						: state.points,
			};
		case "nextQuestion":
			return {
				...state,
				index: state.index + 1,
				answer: null,
			};
		case "finishQuiz":
			return {
				...state,
				status: "finished",
				highscore:
					state.points > state.highscore ? state.points : state.highscore,
			};
		case "restart":
			return {
				...initialState,
				questions: state.questions,
				status: "ready",
				highscore: state.highscore,
			};
		case "tick":
			return {
				...state,
				secondsRemaining: state.secondsRemaining - 1,
				status: state.secondsRemaining === 0 ? "finished" : state.status,
				highscore:
					state.secondsRemaining === 0
						? Math.max(state.points, state.highscore)
						: state.highscore,
			};
		default:
			throw new Error("Action unknown");
	}
}

function QuizProvider({ children }) {
	const [
		{ questions, status, index, answer, points, highscore, secondsRemaining },
		dispatch,
	] = useReducer(reducer, initialState);
	const numQuestions = questions.length;
	const maxPossiblePoints = questions.reduce(
		(prev, cur) => prev + cur.points,
		0
	);
	return (
		<QuizContext.Provider
			value={{
				questions,
				status,
				index,
				answer,
				points,
				highscore,
				secondsRemaining,
				dispatch,
				numQuestions,
				maxPossiblePoints,
			}}
		>
			{children}
		</QuizContext.Provider>
	);
}

function useQuiz() {
	const context = useContext(QuizContext);
	if (context === undefined)
		throw new Error("Quiz context used outside quiz provider scope.");
	return context;
}

export { QuizProvider, useQuiz };
