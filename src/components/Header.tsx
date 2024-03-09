import styled from 'styled-components';

type HeaderProps = {
  headerText: string;
};

const Header: React.FC<HeaderProps> = ({ headerText }) => {
  return <Head>{headerText}</Head>;
};

const Head = styled.h1`
  margin: 20px;
`;

export default Header;
