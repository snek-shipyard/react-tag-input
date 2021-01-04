import React from "react";
import { Tag } from "./components/Tag";
import { classSelectors } from "./utils/selectors";

type Significance =
  | "LIGHT"
  | "SUCCESS"
  | "DANGER"
  | "WARNING"
  | "INFO"
  | "DARK";
type TagType = { name: string; significance: Significance };
type Tags = TagType[];
type Colors = { backgroundColor: string; color: string };

export interface ReactTagInputProps {
  tags: Tags;
  onChange: (tags: Tags) => void;
  placeholder?: string;
  maxTags?: number;
  validator?: (val: string) => boolean;
  editable?: boolean;
  readOnly?: boolean;
  removeOnBackspace?: boolean;
}

interface State {
  input: string;
  colors: Colors;
  significance: Significance;
}

export default class ReactTagInput extends React.Component<
  ReactTagInputProps,
  State
> {
  state: State = {
    input: "",
    colors: { backgroundColor: "#e1e1e1", color: "#333" },
    significance: "LIGHT",
  };

  // Ref for input element
  inputRef: React.RefObject<HTMLInputElement> = React.createRef();

  onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ input: e.target.value });
  };

  onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { input, significance } = this.state;
    const { validator, removeOnBackspace } = this.props;

    // On enter
    if (e.keyCode === 13) {
      // Prevent form submission if tag input is nested in <form>
      e.preventDefault();

      // If input is blank, do nothing
      if (input === "") {
        return;
      }

      // Check if input is valid
      const valid = validator !== undefined ? validator(input) : true;
      if (!valid) {
        return;
      }

      // Add input to tag list
      this.addTag(input, significance);
    }
    // On backspace or delete
    else if (removeOnBackspace && (e.keyCode === 8 || e.keyCode === 46)) {
      // If currently typing, do nothing
      if (input !== "") {
        return;
      }

      // If input is blank, remove previous tag
      this.removeTag(this.props.tags.length - 1);
    }
  };

  addTag = (name: string, significance: Significance) => {
    const tags = [...this.props.tags];
    const tag = { name, significance };
    if (!tags.includes(tag)) {
      tags.push(tag);
      this.props.onChange(tags);
    }
    this.setState({ input: "" });
  };

  removeTag = (i: number) => {
    const tags = [...this.props.tags];
    tags.splice(i, 1);
    this.props.onChange(tags);
  };

  updateTag = (i: number, name: string) => {
    const tags = [...this.props.tags];
    const numOccurencesOfValue = tags.reduce(
      (prev, currentValue, index) =>
        prev + (currentValue.name === name && index !== i ? 1 : 0),
      0
    );
    if (numOccurencesOfValue > 0) {
      tags.splice(i, 1);
    } else {
      tags[i].name = name;
    }
    this.props.onChange(tags);
  };

  onValueChange = (event: any) => {
    let significance = event.currentTarget.value;

    this.setState({
      significance,
    });
  };

  render() {
    const { input } = this.state;

    const {
      tags,
      placeholder,
      maxTags,
      editable,
      readOnly,
      validator,
      removeOnBackspace,
    } = this.props;

    const maxTagsReached =
      maxTags !== undefined ? tags.length >= maxTags : false;

    const isEditable = readOnly ? false : editable || false;

    const showInput = !readOnly && !maxTagsReached;

    return (
      <div className="tag-input-color-selector">
        <div className={classSelectors.wrapper}>
          <input
            type="radio"
            name="color"
            id="Light"
            value="LIGHT"
            checked={this.state.significance === "LIGHT"}
            onChange={this.onValueChange}
          />
          <label htmlFor="Light">
            <span className="Light"></span>
          </label>
          <input
            type="radio"
            name="color"
            id="Success"
            value="SUCCESS"
            checked={this.state.significance === "SUCCESS"}
            onChange={this.onValueChange}
          />
          <label htmlFor="Success">
            <span className="Success"></span>
          </label>
          <input
            type="radio"
            name="color"
            id="Danger"
            value="DANGER"
            checked={this.state.significance === "DANGER"}
            onChange={this.onValueChange}
          />
          <label htmlFor="Danger">
            <span className="Danger"></span>
          </label>

          <input
            type="radio"
            name="color"
            id="Warning"
            value="WARNING"
            checked={this.state.significance === "WARNING"}
            onChange={this.onValueChange}
          />
          <label htmlFor="Warning">
            <span className="Warning"></span>
          </label>

          <input
            type="radio"
            name="color"
            id="Info"
            value="INFO"
            checked={this.state.significance === "INFO"}
            onChange={this.onValueChange}
          />
          <label htmlFor="Info">
            <span className="Info"></span>
          </label>

          <input
            type="radio"
            name="color"
            id="Dark"
            value="DARK"
            checked={this.state.significance === "DARK"}
            onChange={this.onValueChange}
          />
          <label htmlFor="Dark">
            <span className="Dark"></span>
          </label>
        </div>
        <div className={classSelectors.wrapper}>
          {tags.map((tag, i) => (
            <Tag
              key={i}
              value={tag.name}
              index={i}
              editable={isEditable}
              readOnly={readOnly || false}
              inputRef={this.inputRef}
              update={this.updateTag}
              remove={this.removeTag}
              validator={validator}
              removeOnBackspace={removeOnBackspace}
              significance={tag.significance}
            />
          ))}
          {showInput && (
            <input
              ref={this.inputRef}
              value={input}
              className={classSelectors.input}
              placeholder={placeholder || "Type and press enter"}
              onChange={this.onInputChange}
              onKeyDown={this.onInputKeyDown}
            />
          )}
        </div>
      </div>
    );
  }
}
