'use client'

import { Course } from '@/payload-types'
import { useEffect, useState } from 'react'
import { HiArrowRight } from 'react-icons/hi2'
import NextButton from './NextButton'
import { markProgress } from '../actions/markProgress'

export default function QuizModule({
  module,
  participationId,
  onCompleted,
}: {
  module: Extract<NonNullable<Course['curriculum']>[number], { blockType: 'quiz' }>
  onCompleted: (nextIndex: number) => void
  participationId: string
}) {
  const [message, setMessage] = useState('')
  const [userAnswers, setUserAnswers] = useState<boolean[][]>([])
  const [loading, setLoading] = useState(false)
  const [allAnswersCorrect, setAllAnswersCorrect] = useState(false)

  useEffect(
    () => setUserAnswers(module.questions.map((question) => question.answers.map(() => false))),
    [module.questions],
  )

  function checkAnswer(questionIndex: number) {
    const answersLength = module.questions[questionIndex].answers.length
    for (let answerIndex = 0; answerIndex < answersLength; answerIndex++) {
      const isUserAnswer = userAnswers[questionIndex][answerIndex]
      const question = module.questions[questionIndex]
      const isCorrectAnswer = question.answers[answerIndex].correct
      if (isCorrectAnswer !== isUserAnswer) {
        return false
      }
    }
    return true
  }

  function checkAllAnswers() {
    for (let i = 0; i < module.questions.length; i++) {
      if (!checkAnswer(i)) {
        return false
      }
    }
    return true
  }

  async function handleNextModule() {
    setLoading(true)
    try {
      const updatedParticipation = await markProgress(participationId)
      if (updatedParticipation && updatedParticipation.progress) {
        onCompleted(updatedParticipation.progress)
      } else {
        console.error('Failed to update participation progress')
      }
    } catch (error) {
      console.error('Error marking progress:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <h2 className="text-2xl font-bold">{module.title}</h2>
      <div className="relative w-full aspect-video border border-white p-6 overflow-hidden">
        {module.questions.map((question, i) => {
          return (
            <div key={i} className="flex flex-row gap-2  mb-6">
              <div className="flex flex-col gap-4 ">
                <p className={`font-bold`}>
                  {i + 1}. {question.question}
                </p>
                {question.answers.map((answer, index) => (
                  <div className="flex items-center cursor-pointer" key={`${i}-${index}-${answer}`}>
                    <input
                      id={'default-checkbox' + index}
                      type="checkbox"
                      onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                        setMessage('')
                        const tempAns = JSON.parse(JSON.stringify(userAnswers))
                        tempAns[i][index] = e.currentTarget.checked
                        setUserAnswers(tempAns)
                      }}
                      className={`h-4 w-4 text-teal-500 bg-gray-100 border-gray-300 rounded-full focus:ring-teal-400  focus:ring-2`}
                    />
                    <label
                      htmlFor={'default-checkbox' + index}
                      className={`ml-4 cursor-pointer font-medium text-white text-2xl`}
                    >
                      {answer.answer}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {message && <div className={`text-red-500 p-2 text-end fond-bold `}>{message}</div>}
      <div className="flex flex-col gap-4 justify-start">
        <div className="flex">
          {allAnswersCorrect ? (
            <NextButton loading={loading} text="Next" onClick={handleNextModule} />
          ) : (
            <button
              disabled={allAnswersCorrect}
              className={`${allAnswersCorrect ? 'btn-primary-outline' : 'btn-primary'}`}
              onClick={() => {
                if (checkAllAnswers()) {
                  setUserAnswers([])
                  setAllAnswersCorrect(true)
                } else {
                  setMessage(
                    'Not all answers are correct. Please check your answers again. Multiple answers can be correct.',
                  )
                }
              }}
            >
              <div className="flex gap-2 items-center">
                <span>Check Answers</span>
                <HiArrowRight className="h-4 w-4" />
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
