import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const StatisticsSkeleton = () => {
  return (
    <div style={{ borderRadius: '5px', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#d1eaff' }}>
            {[1,2,3].map((i)=>(
              <th key={i} style={{ padding: 10 }}>
                <div style={{ display:'flex', justifyContent:'center', alignItems:'center' }}>
                  <Skeleton width={100} height={20} />
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
                  <div style={{
                    display:'flex',
                    justifyContent:'center',
                    alignItems:'center'
                  }}>
                    <Skeleton width={100} height={18} />
                  </div>
                </td>
              ))}
            </tr>
          ))}
          {/* total row */}
          <tr>
            {[1,2,3].map((col)=>(
              <td key={col} style={{ padding: 10 }}>
                <div style={{
                  display:'flex',
                  justifyContent:'center',
                  alignItems:'center'
                }}>
                  <Skeleton width={100} height={20} />
                </div>
              </td>
            ))}
          </tr>
          <tr style={{ background: '#004688' }}>
            {[1,2,3].map((col)=>(
              <td key={col} style={{ padding: 10 }}>
                <div style={{
                  display:'flex',
                  justifyContent:'center',
                  alignItems:'center'
                }}>
                  <Skeleton width={100} height={20} />
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
