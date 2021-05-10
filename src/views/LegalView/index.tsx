import React from 'react'
import Text from '@/shared/components/Text'
import { Box, TextWrapper, Paragraph, ListItem, Container } from './LegalView.style'

const Legal: React.FC = () => {
  return (
    <Container>
      <Box>
        <TextWrapper>
          <Text variant="h5">DMCA Policy For Content Takedown</Text>
          <Paragraph>
            Jsgenesis AS, the developers of the Joystream protocol, have established a copyright infringement policy in
            accordance with the Digital Millennium Copyright Act.
            <br />
            <br />
            Copyright owners and their agents may notify us in cases where content hosted on our testnets (available
            publicly at [play.joystream.org] and [testnet.joystream.org]) infringes on their copyrights by sending a
            DMCA notice to us using the contact information below.
            <br />
            <br />
            Upon receipt of a valid and complete notice, we will remove the content from our public-facing applications
            as quickly as possible. We may also suspend the ability of the uploader to participate further on our
            testnet.
            <br />
            <br />
            Where possible, we will attempt to notify the alleged infringer of the takedown, with a copy of your DMCA
            Notice, using the contact information provided to us.
            <br /> <br />
            You can be held liable for damages, including costs and attorney fees, if you materially misrepresent that
            material or activity infringes on your copyright.
          </Paragraph>
          <Paragraph header>Requirements for DMCA Notices</Paragraph>
          <Paragraph>Your DMCA Notice must include all of the following information:</Paragraph>
          <ol>
            <ListItem>
              A physical or electronic signature of the copyright owner, or a person authorized to act on behalf of the
              copyright owner;
            </ListItem>
            <ListItem>Identification (URL) of the copyrighted work or material being infringed upon;</ListItem>
            <ListItem>
              Description of the work or material that you claim to be infringing and would like to be removed,
              including information regarding its location (URL) with enough detail so that we can and verify it;
            </ListItem>
            <ListItem>
              Your full legal name, mailing address, telephone number, and email address where we can contact you;
            </ListItem>
            <ListItem>
              A statement that you have a good faith belief that use of the material in the manner complained of is not
              authorized by the copyright owner, its agent, or the law; and
            </ListItem>
            <ListItem>
              A statement that the information in your DMCA Notice is accurate, and under penalty of perjury, that you
              are the copyright owner or are authorized to act on behalf of the copyright owner.
            </ListItem>
          </ol>
          <Paragraph header>DMCA Agent Information</Paragraph>
          <Paragraph>
            Our dedicated email address for DMCA notifications is: abuse@jsgenesis.com.
            <br />
            Alternatively you can contact us by post:
            <br />
            <br />
            Designated DMCA Agent Jsgenesis AS
            <br />
            CO UMA Workspace Stenersgata 8
            <br />
            Oslo, 0184 Norway
            <br />
            <br />
            Or by telephone: +44789553019
          </Paragraph>
          <Paragraph header>DMCA Counter Notification</Paragraph>
          <Paragraph>
            If your content has been mistakenly removed from our testnet, you can submit a DMCA Counter Notification
            using the same contact information shown above.
            <br />
            <br />
            Your DMCA Counter Notification must include all of the following information:
          </Paragraph>

          <ol>
            <ListItem>Your physical or electronic signature;</ListItem>
            <ListItem>
              Identification (URL) of the material that has been removed or to which access has been disabled and the
              location at which the material appeared before it was removed or access to it was disabled (the
              description from the DMCA Notice is acceptable);
            </ListItem>
            <ListItem>
              A statement under penalty of perjury that you have a good faith belief that the material was removed or
              disabled as a result of mistake or misidentification of the material to be removed or disabled;
            </ListItem>
            <ListItem>
              Your full legal name, mailing address, telephone number, and email address where we can contact you; and
            </ListItem>
            <ListItem>
              A statement that you consent to the jurisdiction of Federal District Court for the judicial district in
              which your address is located, or if your address is outside of the United States, for any judicial
              district in which Jsgenesis may be found, and that you will accept service of process from the person who
              provided the DMCA Notice or an agent of such person.
            </ListItem>
          </ol>
          <Paragraph>
            If we receive valid DMCA Counter Notification that meets the above requirements, we will forward a copy to
            the person who filed the original DMCA Notice. If we do not receive notice within 10 business days that the
            person who submitted the DMCA Notice is seeking a court order to prevent the infringement of the content at
            issue, we will replace or re-enable access to the content that was removed.
          </Paragraph>
        </TextWrapper>
      </Box>
    </Container>
  )
}

export default Legal
