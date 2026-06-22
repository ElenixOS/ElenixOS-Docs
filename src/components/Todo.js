import Admonition from '@theme/Admonition';
import Translate from '@docusaurus/Translate';

export default function Todo({title, children}) {
  return (
    <Admonition type="info" title={title ?? <Translate id="todo.title">TODO</Translate>}>
      {children ?? (
        <p>
          <Translate id="todo.defaultContent">
            This section is under construction. Please check back later.
          </Translate>
        </p>
      )}
    </Admonition>
  );
}
