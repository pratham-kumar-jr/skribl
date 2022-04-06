import { CursorContext } from "../providers/CursorProvider";

export default function withCursor(Component: any) {
  return function WrapperComponent(props: any) {
    return (
      <CursorContext.Consumer>
        {state => <Component {...props} context={state} />}
      </CursorContext.Consumer>
    );
  };
}
