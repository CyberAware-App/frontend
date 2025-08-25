import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { For } from "@/components/common/for";
import { IconBox } from "@/components/common/IconBox";
import { DialogAnimated, RadioGroupAnimated } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { apiSchema } from "@/lib/api/callBackendApi";
import type { SelectedModule, SelectedQuizzes } from "@/lib/react-query/queryOptions";

export const QuizSchema = z
	.record(z.string(), apiSchema.routes["@post/quiz"].body.unwrap())
	.transform((data) => Object.values(data)) as unknown as (typeof apiSchema.routes)["@post/quiz"]["body"];

type QuizFormProps = {
	onSubmit: ReturnType<UseFormReturn["handleSubmit"]>;
	form: UseFormReturn<z.infer<typeof QuizSchema>>;
	selectedModule: SelectedModule;
	selectedQuizzes: SelectedQuizzes;
};

function QuizForm(props: QuizFormProps) {
	const { form, selectedModule, onSubmit, selectedQuizzes } = props;

	return (
		<>
			<article className="flex flex-col gap-10">
				<h3 className="text-[28px] font-semibold text-cyberaware-aeces-blue">
					{selectedModule.title} Quiz:
				</h3>

				<Form.Root
					id="quiz-form"
					methods={form}
					onSubmit={(event) => void onSubmit(event)}
					className="gap-10"
				>
					<For
						each={selectedQuizzes}
						renderItem={(quiz, quizIndex) => (
							<Form.Field
								key={quiz.id}
								control={form.control}
								name={`${quizIndex}.question`}
								className="flex flex-col gap-5"
							>
								<Form.Label className="flex gap-1.5 text-cyberaware-aeces-blue">
									<span>{quizIndex + 1}.</span> <p>{quiz.question}</p>
								</Form.Label>

								<Form.Input hidden={true} type="text" value={quiz.question} />

								<Form.Field
									key={quiz.id}
									control={form.control}
									name={`${quizIndex}.selected_option`}
									className="ml-3"
								>
									<Form.FieldController
										render={({ field }) => (
											<RadioGroupAnimated.Root
												value={(field.value as string | undefined) ?? ""}
												onValueChange={field.onChange}
											>
												<For
													each={Object.entries(quiz.options)}
													renderItem={([option, value]) => (
														<div
															className="flex items-center gap-2 text-cyberaware-aeces-blue"
															key={value}
														>
															<RadioGroupAnimated.Item
																id={value}
																value={option}
																className="size-5 border-cyberaware-aeces-blue
																	data-[state=checked]:bg-cyberaware-aeces-blue
																	data-[state=checked]:text-white"
															>
																<div className="grid">
																	<span className="[grid-area:1/1]">
																		{option.toLowerCase()}
																	</span>

																	<RadioGroupAnimated.Indicator className="[grid-area:1/1]">
																		{option.toLowerCase()}
																	</RadioGroupAnimated.Indicator>
																</div>
															</RadioGroupAnimated.Item>
															<Form.Label htmlFor={value}>{value}</Form.Label>
														</div>
													)}
												/>
											</RadioGroupAnimated.Root>
										)}
									/>

									<Form.ErrorMessage />
								</Form.Field>
							</Form.Field>
						)}
					/>
				</Form.Root>
			</article>

			<DialogAnimated.Root>
				<article className="flex flex-col gap-7">
					<DialogAnimated.Trigger asChild={true}>
						<Button theme="orange" className="gap-2.5">
							Submit
							<IconBox icon="ri:brain-2-line" className="size-5" />
						</Button>
					</DialogAnimated.Trigger>

					<p className="text-[12px] font-medium text-cyberaware-aeces-blue">
						Your progress is saved automatically. You’ll can go to Module {selectedModule.id + 1}{" "}
						after completing this quiz.
					</p>
				</article>

				<DialogAnimated.Content
					withCloseBtn={false}
					classNames={{
						base: `top-[70%] max-w-[367px] translate-y-[-70%] gap-[60px] rounded-none border-none
						px-5.5 pt-8 pb-[170px]`,
						overlay: "bg-[hsl(0,0%,85%)]/70 backdrop-blur-[4px]",
					}}
				>
					<DialogAnimated.Header className="flex-row justify-center">
						<DialogAnimated.Title
							className="max-w-[240px] text-center text-[28px] font-semibold
								text-cyberaware-aeces-blue"
						>
							Are you sure you want to submit?
						</DialogAnimated.Title>
					</DialogAnimated.Header>

					<DialogAnimated.Footer className="flex-row gap-4">
						<DialogAnimated.Close asChild={true}>
							<Button theme="blue-ghost">Cancel</Button>
						</DialogAnimated.Close>

						<Form.Submit form="quiz-form" asChild={true}>
							<DialogAnimated.Close asChild={true}>
								<Button theme="orange" className="gap-2.5">
									Submit
									<IconBox icon="ri:brain-2-line" className="size-5" />
								</Button>
							</DialogAnimated.Close>
						</Form.Submit>
					</DialogAnimated.Footer>
				</DialogAnimated.Content>
			</DialogAnimated.Root>
		</>
	);
}

export { QuizForm };
