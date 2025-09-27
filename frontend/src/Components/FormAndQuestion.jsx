export default function FormAndQuestion({form, setForm, opinions, fetchRates, fetchStudy, setIsClickedTimes, setError}){
    async function handleGiveUserOpinion(form){
        (form.mail && form.username && form.choiceId) && await fetch([`${import.meta.env.VITE_APP_API_URL}`, "/users/opinion"].join(""), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"},
            body: JSON.stringify(form)
        })
        .then(res => res.json())
        .then(res => {
          res?.error ? setError(res.error) : setError("")
      }
    )
        .then()
        fetchRates()
        fetchStudy()
        setIsClickedTimes(ict => ict + 1)
    }
    return <div className="formAndQuestion">
      
        <div className="inputs">
            <label htmlFor="username">Username</label>
            <input type="text" value={form.username} onChange={(e) => setForm({...form, username: e.target.value})} id="username"/>

            <label htmlFor="mail">Mail</label>
            <input type="text" value={form.mail} onChange={(e) => setForm({...form, mail: e.target.value})} id="mail"/>

            <label htmlFor="age">Age</label>
            <input type="number" value={form.age} onChange={(e) => setForm({...form, age: e.target.value})} id="age"/>
        </div>    

        <div className="survey">
        <p className="question">Quel est d'après vous le régime économique (voire politique) qui nous permettrait d'avoir une vie plus égalitaire, pour que tout le monde ait les mêmes chances de réussite ?</p>
        <div className="opinions">
            {opinions.map((o) => 
                <div className="opinion" style={form.choiceId === o._id ? {backgroundColor: "green", color: "white"} : {}} onClick={() => setForm(f => ({...f, choiceId: o._id}))} key={o._id}><span>{o.label}</span></div>
            )}
        </div>
        </div>
        <button onClick={() => handleGiveUserOpinion(form)}> Send opinion</button>
    </div>
}