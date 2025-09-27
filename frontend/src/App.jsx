import { useState } from 'react'
import './App.css'
import { useEffect } from 'react'
import FormAndQuestion from './Components/FormAndQuestion'
import { PieChart } from '@mui/x-charts/PieChart';

function App() {
  const [form, setform] = useState({
    username: "",
    mail: "",
    age: 0,
    choiceId: 0
  })

  const [isClickedTimes, setIsClickedTimes] = useState(0)

  const [opinions, setOpinions] = useState([])

  const [rates, setRates] = useState([])

  const [study, setStudy] = useState([])

  const [error, setError] = useState("")

  useEffect(() => {
    try {
      fetch([`${import.meta.env.VITE_APP_API_URL}`, "/opinions"].join(""))
      .then(res => res.json())
      .then( res => {
          res?.error ? setError(res.error) : setOpinions(res)
  
      })
    } catch (error) {
      console.error(error.message)
    }
  }, [])

  useEffect(() => {
    fetchRates()
  }, [isClickedTimes])

  useEffect(() => {
    fetchStudy()
  }, [isClickedTimes])

  function fetchRates(){
    try {
      fetch([`${import.meta.env.VITE_APP_API_URL}`, "/opinions/rates"].join(""))
      .then(res => res.json())
      .then( res => {
          res?.error ? setError(res.error) : setRates(() => res)
          setRates((r) => r.counts.map((c) => ({
            label: c.label,
            value: c.count ? ((c.count * 100) / r.length).toFixed(2) : 0
          })))
      })
    } catch (error) {
      console.error(error.message)
    }
  }

  function fetchStudy(){
    try {
      fetch([`${import.meta.env.VITE_APP_API_URL}`, "/users/study"].join(""))
      .then(res => res.json())
      .then( res => {
          res?.error ? setError(res.error) : setStudy(res)
      })
    } catch (error) {
      console.error(error.message)
    }
  }
  
  return (
    <div className='app'>
      <div className="error" style={error ? {display: "flex"} : {display: "none"}}>
        <p>{error}</p>
      </div>
      <div className="great-survey">
        <img src="/marteau2.png" alt="marteau2.png" width='80px'/>
        <h1>Great Survey</h1>
      </div>
      <div className="rates">
        <div className="max">
          <span>Le doyen possède</span>
          <span className="age">{study.maxAge}</span>
          <span>ans</span>
        </div>
        <div className="average">
          <span>La moyenne des âges est</span>
          <span className="age">{study.averageAge?.toFixed(2)}</span>
          <span>ans</span>
        </div>
        <div className="average">
          <span>La benjamin possède</span>
          <span className="age">{study.minAge}</span>
          <span>ans</span>
        </div>
      </div>
      <FormAndQuestion 
        form={form}
        setForm={setform}
        opinions={opinions}
        fetchRates={fetchRates}
        fetchStudy={fetchStudy}
        setIsClickedTimes={setIsClickedTimes}
        setError={setError}
      />
      <div className="chart">
        <PieChart
            series={[
                {
                data: rates,
                highlightScope: { fade: 'global', highlight: 'item' },
                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                innerRadius: 70,
                outerRadius: 85,
                },
            ]}
            colors={["#199F65", "#FCA311", "#F63C6B", "#28427B"]}
            height={200}
            width={200}
        />
      </div>
    </div>
  )
}

export default App
