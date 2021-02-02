import styled from "styled-components";

const Button = styled.button`
  ${props => (props.flip ? "#006168" : "white")};
  font-size: 13px;
  font-weight: bold;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  color: ${props => (props.ghost ? "#E64C38" : "#fff")};
  border-radius: 3px;
  border: ${props => (props.ghost ? "2px solid #e64c38" : "1px solid #e64c38")};
  background-color: ${props => (props.ghost ? "#fff" : "#E64C38")};
  padding: 10px 20px;
  transition: 0.3s ease;
  cursor: pointer;
  :hover {
    color: ${props => (props.ghost ? "#fff" : "#fff")};
    background-color: #e64c38;
    transform: scale(1.05);
    filter: drop-shadow(0px 0px 12px rgba(0, 0, 0, 0.3));
    transition: 0.3s ease;
  }
  :focus {
    outline: none;
  }
`;

export default Button;
