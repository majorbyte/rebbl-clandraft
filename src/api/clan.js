export default {
  getMatchup : async () => {
    let result = await fetch(`http://localhost:3000/api/v2/clan/draft/`);
    if (result.ok){
      let data = await result.json();
      return data.schedule;
    }
    return null;
  },
  getPowers : async () => {
    let result = await fetch(`http://localhost:3000/api/v2/clan/powers`);
    if (result.ok) return await result.json();
    return null;
  },
  saveContests : async (data) => {
    console.dir(data);
  }
}