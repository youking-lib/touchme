import { LOGO } from "@repo/utils/constants";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import Footer from "./components/footer";

export default function LoginCode({
  email = "panic@thedis.co",
  code = "code",
  url = "http://localhost:3000/login?email=your-email@example.com&code=your-verfiy-code",
}: {
  email: string;
  code: string;
  url: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Your TouchMe.Pro Login Code</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[500px] rounded border border-solid border-gray-200 px-10 py-5">
            <Section className="mt-8">
              <Img
                src={LOGO}
                width="40"
                height="40"
                alt="Dub"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-7 p-0 text-center text-xl font-semibold text-black">
              Your Login Code
            </Heading>
            <Text className="text-sm leading-6 text-black">
              Welcome to TouchMe.Pro!
            </Text>
            <Text className="text-sm leading-6 text-black">
              Please click the magic link below to sign in to your account or
              copy to continue.
            </Text>
            <Section className="my-8 text-center">
              <Link
                className="rounded-full bg-black px-6 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={url}
              >
                {code}
              </Link>
            </Section>
            <Footer email={email} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
