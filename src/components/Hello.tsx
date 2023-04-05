import './Hello.css';

interface HelloProps {}

const Hello: React.FC<HelloProps> = () => {
	return (
		<div className="container">
			<strong>Hello, World 👋</strong>
		</div>
	);
};

export default Hello;
