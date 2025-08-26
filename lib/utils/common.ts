export const shuffleArray = <TArray extends unknown[]>(array: TArray | undefined) => {
	if (!array) return;

	const shuffledArray = structuredClone(array);

	// == Using Fisher-Yates algorithm
	for (let lastElementIndex = shuffledArray.length - 1; lastElementIndex > 0; lastElementIndex--) {
		const randomIndex = Math.floor(Math.random() * (lastElementIndex + 1));

		[shuffledArray[lastElementIndex], shuffledArray[randomIndex]] = [
			shuffledArray[randomIndex],
			shuffledArray[lastElementIndex],
		];
	}

	return shuffledArray;
};

export const getUserAvatar = (name?: string) =>
	name ?
		`https://avatar.iran.liara.run/username?username=${name}`
	:	"https://avatar.iran.liara.run/public/boy";
