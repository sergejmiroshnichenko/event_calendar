import { styled } from 'styled-components';
import theme from 'styles/theme.ts';

export const Cells = styled.div<{
  $isWeekend?: boolean;
  $isCurrentDay?: boolean;
  $isHeader?: boolean;
  $isCurrentMonth?: boolean;
}>`
  min-height: ${({ $isHeader }) => ($isHeader ? 24 : 80)}px;
  border-radius: ${({ $isHeader }) => ($isHeader ? '' : 5)}px;
  opacity: ${({ $isWeekend }) => $isWeekend && 0.7};
  background: ${({ $isHeader }) => ($isHeader ? '#efebe9' : 'white')};
  display: flex;
  min-width: 110px;
  padding: 5px;
  justify-content: space-between;
  flex-direction: row-reverse;
  color: ${({ $isCurrentMonth }) => ($isCurrentMonth ? 'black' : '#bdbdbd')};
`;

export const DayWrapper = styled.div``;

export const CurrentDay = styled.span`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  margin: -5px;
  border: 1px solid ${theme.colors.whiteDefault};
  z-index: 1;
  position: relative;
  background: ${theme.colors.currentDay};
  color: ${theme.colors.blackDefault};
  box-shadow: ${theme.shadows.secondary};
`;

export const EventListWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  align-self: end;
  width: 100%;
`;

export const EventItemWrapper = styled.button<{
  $bg: string | undefined;
}>`
  background: ${({ $bg }) => $bg};
  color: ${theme.colors.blackDefault};
  padding: 1px 5px;
  opacity: 0.6;
  font-size: 14px;
  border: 0.0625rem solid ${theme.colors.whiteDefault};
  border-radius: 0.5rem;
  box-shadow: ${theme.shadows.secondary};
  word-break: break-all;
  transition: transform 0.7s ease-in-out, filter 0.7s ease-in-out;

  &:hover {
    transform: scale(1.05);
    filter: brightness(125%);
    border: 0.0625rem solid ${theme.colors.modalConfirm};
  }
}
`;
