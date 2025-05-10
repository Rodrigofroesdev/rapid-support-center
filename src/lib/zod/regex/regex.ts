const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nomeRegex = /^[a-zA-ZÀ-ÿ'.-]{2,}(?:\s+[a-zA-ZÀ-ÿ'.-]{2,})+$/;
const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export { emailRegex, nomeRegex, senhaRegex };