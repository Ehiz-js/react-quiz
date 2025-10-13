function Progress({ points, index, numQuestions, maxPossiblePoints, answer }) {
	return (
		<header className="progress">
			<progress
				value={index + Number(answer !== null)}
				max={numQuestions - 1}
			/>
			<p>
				Question <strong>{index + 1}</strong>/{numQuestions}
			</p>
			<p>
				<strong>{points}</strong>/{maxPossiblePoints} points
			</p>
		</header>
	);
}

export default Progress;
