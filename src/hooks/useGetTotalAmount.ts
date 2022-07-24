import useGetTransactions from "./useGetTransactions";

const useGetTotalAmount = (id: string) => {
  const transActions = useGetTransactions(id);
  const priceArray = transActions?.data?.map(({ price }) => price);
  if (priceArray && priceArray.length > 0) {
    const sum = priceArray.reduce((acc, current) => acc + current);
    return sum;
  } else return 0;
};

export default useGetTotalAmount;
