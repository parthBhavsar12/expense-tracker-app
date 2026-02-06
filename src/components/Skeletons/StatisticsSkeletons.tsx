import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const center = {
  display:'flex',
  justifyContent:'center',
  alignItems:'center',
  width:'100%'
};

const box = {
  width:'100%',
  maxWidth:100   // keeps same design but allows shrink
};

const StatisticsSkeleton = () => {
  return (
    <div style={{ borderRadius: '5px', overflow: 'hidden', width:'100%' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>

        <thead>
          <tr style={{ background: '#d1eaff' }}>
            {[1,2,3].map((i)=>(
              <th key={i} style={{ padding: 10 }}>
                <div style={center}>
                  <div style={box}>
                    <Skeleton height={20}/>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {[1,2,3,4,5].map((row) => (
            <tr key={row}>
              {[1,2,3].map((col)=>(
                <td key={col} style={{ padding: 10 }}>
                  <div style={center}>
                    <div style={box}>
                      <Skeleton height={18}/>
                    </div>
                  </div>
                </td>
              ))}
            </tr>
          ))}

          {/* total row */}
          <tr>
            {[1,2,3].map((col)=>(
              <td key={col} style={{ padding: 10 }}>
                <div style={center}>
                  <div style={box}>
                    <Skeleton height={20}/>
                  </div>
                </div>
              </td>
            ))}
          </tr>

          {/* final row */}
          <tr style={{ background: '#004688' }}>
            {[1,2,3].map((col)=>(
              <td key={col} style={{ padding: 10 }}>
                <div style={center}>
                  <div style={box}>
                    <Skeleton height={20}/>
                  </div>
                </div>
              </td>
            ))}
          </tr>

        </tbody>
      </table>
    </div>
  );
};

export default StatisticsSkeleton;
