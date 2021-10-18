export const integerTransformer = (value, alternative = 0) => {
    const parsed = parseInt(value, 10);
  
    return Number.isNaN(parsed)
      ? alternative
      : Number(Math.floor(Math.abs(parsed)));
  };