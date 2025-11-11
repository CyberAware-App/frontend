export const shuffleArray = <TArray extends unknown[]>(array: TArray | undefined) => {
	if (!array) return;

	const shuffledArray = [...array];

	// == Using Fisher-Yates algorithm
	for (let lastIndex = shuffledArray.length - 1; lastIndex > 0; lastIndex--) {
		const randomIndex = Math.floor(Math.random() * (lastIndex + 1));

		[shuffledArray[lastIndex], shuffledArray[randomIndex]] = [
			shuffledArray[randomIndex],
			shuffledArray[lastIndex],
		];
	}

	return shuffledArray;
};

export const getUserAvatar = (firstName: string, lastName: string) => `${firstName[0]}${lastName[0]}`;
