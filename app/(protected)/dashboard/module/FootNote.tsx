import type { SelectedModule } from "@/lib/react-query/queryOptions";

type FootNoteProps = {
	selectedModule: SelectedModule;
};

function FootNote(props: FootNoteProps) {
	const { selectedModule } = props;

	return (
		<p className="text-[12px] font-medium text-cyberaware-aeces-blue">
			Your progress is saved automatically. You’ll can go to Module {selectedModule.id + 1} after
			completing this quiz.
		</p>
	);
}

export { FootNote };
