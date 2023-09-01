import React, { useCallback } from "react";
import styled from "styled-components";

const Wrap = styled.div`
  display: flex;
`;

const Button = styled.a`
  display: inline-flex;
  border: 1px solid #f2f2f2;
  border-radius: 8px;
  padding: 0.65em 1.2em;
  margin: 20px 0;
  align-items: center;
  box-shadow: rgba(67, 71, 85, 0.27) 0px 0px 0.25em,
    rgba(90, 125, 188, 0.05) 0px 0.25em 1em;
  background: #f2f2f2;

  &:hover {
    cursor: pointer;
  }
`;

const Logo = styled.div`
  img {
    max-width: 30px;
  }
`;

const Content = styled.div`
  margin-left: 15px;
  display: flex;
  flex-flow: column;
  color: #333;
`;

const ExtIdentifier = styled.div`
  color: #888;
  font-size: 0.8em;
`;

const Install: React.FC = () => {
  const handleClick = useCallback((e) => {
    const href = "vscode:extension/teamkeel.vscode-keel";

    document.location = href;

    setTimeout(() => {
      // if the document still has focus after 500ms then it means
      // that the vscode uri schema wasn't handled because vscode wasn't installed
      // so link to the web marketplace page instead
      if (document.hasFocus()) {
        document.location =
          "https://marketplace.visualstudio.com/items?itemName=teamkeel.vscode-keel";
      }
    }, 500);
  }, []);
  return (
    <Wrap>
      <Button onClick={handleClick}>
        <Logo>
          <img src="/vscode.png" alt="VSCode marketplace" />
        </Logo>
        <Content>
          <div>
            Install <b>Extension</b>
          </div>
          <ExtIdentifier>teamkeel.vscode-keel</ExtIdentifier>
        </Content>
      </Button>
    </Wrap>
  );
};

export default Install;
