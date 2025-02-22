import {PLACEMENT, StatefulPopover} from 'baseui/popover'
import {navigate} from 'gatsby'
import {down} from 'styled-breakpoints'
import styled from 'styled-components'
import ExternalLink from '../../icons/external_link.svg'
import MoreIcon from '../../icons/more.svg'
import {LineWrap} from './styledComponent'

const MoreButton = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  width: 36px;
  height: 36px;
  background-color: #fff;
  transition: all 0.2s;

  :hover,
  :focus {
    background: #d1ff52;
  }

  ${down('md')} {
    display: none;
  }
`

const ExternalName = styled.span`
  margin-right: 16px;
`

const LINKS = [
  {
    name: 'About',
    link: 'https://phala.network',
  },
  {
    name: 'Wiki',
    link: 'https://wiki.phala.network',
  },
  {
    name: 'Changelog',
    link: 'https://forum.phala.network/t/topic/3320',
  },
  {
    name: 'Forum',
    link: 'https://forum.phala.network/t/topic/2450/2',
  },
  {
    name: 'Discord',
    link: 'https://discord.com/invite/phala',
  },
  {
    name: 'Governance',
    link: 'https://khala.subsquare.io/',
  },
]

const CheckMore: React.FC = () => {
  return (
    <StatefulPopover
      content={({close}) => (
        <>
          <LineWrap
            onClick={() => {
              navigate('/analytics/')
              close()
            }}
          >
            Analytics
          </LineWrap>
          {LINKS.map(({name, link}) => (
            <LineWrap onClick={close} href={link} key={name} target="_blank">
              <ExternalName>{name}</ExternalName>
              <ExternalLink />
            </LineWrap>
          ))}
        </>
      )}
      placement={PLACEMENT.bottom}
      showArrow
      overrides={{
        Arrow: {
          style: {
            outline: `1px #aad829 solid`,
            backgroundColor: '#aad829',
          },
        },
        Body: {
          style: {
            outline: `1px #aad829 solid`,
            backgroundColor: '#eeeeee',
            boxShadow: 'none',
            marginRight: '20px',
          },
        },
      }}
    >
      <MoreButton>
        <MoreIcon />
      </MoreButton>
    </StatefulPopover>
  )
}

export default CheckMore
