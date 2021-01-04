import React from "react";
import { classSelectors } from "../utils/selectors";
import { ContentEditable } from "./ContentEditable";

type Significance =
  | "DEFAULT"
  | "SUCCESS"
  | "DANGER"
  | "WARNING"
  | "INFO"
  | "LIGHT"
  | "DARK";

interface Props {
  value: string;
  index: number;
  editable: boolean;
  readOnly: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  update: (i: number, value: string) => void;
  remove: (i: number) => void;
  validator?: (val: string) => boolean;
  removeOnBackspace?: boolean;
  significance: Significance;
}

export class Tag extends React.Component<Props> {
  innerEditableRef: React.RefObject<HTMLDivElement> = React.createRef();

  remove = () => this.props.remove(this.props.index);

  render() {
    const {
      value,
      index,
      editable,
      inputRef,
      validator,
      update,
      readOnly,
      removeOnBackspace,
      significance,
    } = this.props;

    const tagRemoveClass = !readOnly
      ? classSelectors.tagRemove
      : `${classSelectors.tagRemove} ${classSelectors.tagRemoveReadOnly}`;

    let colors = { backgroundColor: "#e1e1e1", color: "#333" };

    switch (significance) {
      // LIGHT
      case "LIGHT":
        colors = { backgroundColor: "#e1e1e1", color: "#333" };
        break;
      case "SUCCESS":
        colors = { backgroundColor: "#00b74a", color: "#fbfbfb" };
        break;
      case "DANGER":
        colors = { backgroundColor: "#f93154", color: "#fbfbfb" };
        break;
      // WARNING
      case "WARNING":
        colors = { backgroundColor: "#ffa900", color: "#fbfbfb" };
        break;
      // INFO
      case "INFO":
        colors = { backgroundColor: "#39c0ed", color: "#fbfbfb" };
        break;
      // DARK
      case "DARK":
        colors = { backgroundColor: "#252525", color: "#fbfbfb" };
        break;
    }

    return (
      <div
        className={classSelectors.tag}
        style={{ backgroundColor: colors.backgroundColor, color: colors.color }}
      >
        {!editable && <div className={classSelectors.tagContent}>{value}</div>}
        {editable && (
          <ContentEditable
            value={value}
            inputRef={inputRef}
            innerEditableRef={this.innerEditableRef}
            className={classSelectors.tagContent}
            change={(newValue) => update(index, newValue)}
            remove={this.remove}
            validator={validator}
            removeOnBackspace={removeOnBackspace}
          />
        )}
        <div
          className={tagRemoveClass}
          onClick={this.remove}
          style={{
            backgroundColor: colors.backgroundColor,
            color: colors.color,
            filter: "brightness(90%)",
          }}
        />
      </div>
    );
  }
}
