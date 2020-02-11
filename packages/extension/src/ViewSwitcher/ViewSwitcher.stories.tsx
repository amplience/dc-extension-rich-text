import { storiesOf } from "@storybook/react";
import React from "react";
import ViewSwitcher, { EditorView } from "./ViewSwitcher";

class ChangeEventStory extends React.Component<{}, { value: string }> {
  constructor(props: {}) {
    super(props);
    this.state = { value: "" };
    this.handleChange = this.handleChange.bind(this);
  }

  public handleChange(value: EditorView): void {
    this.setState({ value });
  }

  public render(): React.ReactElement {
    return (
      <div>
        <ViewSwitcher onChange={this.handleChange} />
        <div>{this.state.value}</div>
      </div>
    );
  }
}

storiesOf("ViewSwitcher", module)
  .add("Basic", () => <ViewSwitcher />)
  .add("Language", () => <ViewSwitcher language="Markdown" />)
  .add("Change Event", () => <ChangeEventStory />);
