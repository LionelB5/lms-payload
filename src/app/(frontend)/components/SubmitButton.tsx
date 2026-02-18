import { AiOutlineLoading3Quarters } from 'react-icons/ai'

const SubmitButton: React.FC<{ loading: boolean; text: string }> = ({ loading, text }) => {
  return (
    <button
      type="submit"
      disabled={loading}
      className="relative bg-white text-black rounded-md p-2 w-full"
    >
      {text}{' '}
      <div className="h-full absolute top-0 left-2 flex items-center justify-center">
        <AiOutlineLoading3Quarters className={`animate-spin ${loading ? 'block' : 'hidden'}`} />
      </div>
    </button>
  )
}

export default SubmitButton
