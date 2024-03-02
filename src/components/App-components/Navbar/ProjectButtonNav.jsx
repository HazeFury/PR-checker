import useScreeSize from "../../../hooks/useScreenSize";

export default function ProjectButtonNav() {
  const width = useScreeSize();
  return (
    <div>
      <p>{width}</p>
    </div>
  );
}
