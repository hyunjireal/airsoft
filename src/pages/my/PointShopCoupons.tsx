import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import arrowLeftIcon from '../../asset/icons/arrow_l.svg'
import pointshopBestImg01 from '../../asset/images/pointshop_best_img01.png'
import pointshopBestImg03 from '../../asset/images/pointshop_best_img03.png'
import './PointShopCoupons.css'

type CouponTab = 'available' | 'used'

type CouponItem = {
  id: string
  actionLabel: string
  imageAlt: string
  imageSrc: string
  titleLines: string[]
  validity: string
}

const coupons: Record<CouponTab, CouponItem[]> = {
  available: [
    {
      id: 'weekday-field-discount',
      actionLabel: '사용하기',
      imageAlt: '강남 CQB 필드 평일 할인권',
      imageSrc: pointshopBestImg01,
      titleLines: ['강남 CQB 필드', '평일 할인권'],
      validity: '유효기간  2025.06.01 ~ 2026.06.01',
    },
  ],
  used: [
    {
      id: 'protective-gear-rental',
      actionLabel: '사용완료',
      imageAlt: '보호장비 대여 무료 이용권',
      imageSrc: pointshopBestImg03,
      titleLines: ['보호장비 대여 무료 이용권'],
      validity: '유효기간  2025.07.01 ~ 2026.07.01',
    },
  ],
}

function CouponTabButton({
  active,
  count,
  label,
  onClick,
}: {
  active: boolean
  count: number
  label: string
  onClick: () => void
}) {
  return (
    <button
      aria-selected={active}
      className={`point_shop_coupons_tab${active ? ' point_shop_coupons_tab_active' : ''}`}
      role="tab"
      type="button"
      onClick={onClick}
    >
      {label} {count}
    </button>
  )
}

export function PointShopCoupons() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<CouponTab>('available')

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/my/point-shop')
  }

  const activeCoupons = coupons[activeTab]

  return (
    <div className="point_shop_coupons_page">
      <div className="point_shop_coupons_content">
        <header className="point_shop_coupons_header point_shop_coupons_shell">
          <div className="point_shop_coupons_header_left">
            <button className="point_shop_coupons_back_button" type="button" aria-label="뒤로 가기" onClick={goBack}>
              <img className="point_shop_coupons_back_icon" src={arrowLeftIcon} alt="" aria-hidden="true" />
            </button>
            <h1 className="point_shop_coupons_title">내 쿠폰함</h1>
          </div>
        </header>

        <div className="point_shop_coupons_tabs point_shop_coupons_shell" role="tablist" aria-label="쿠폰 상태">
          <CouponTabButton
            active={activeTab === 'available'}
            count={coupons.available.length}
            label="내 쿠폰"
            onClick={() => setActiveTab('available')}
          />
          <CouponTabButton
            active={activeTab === 'used'}
            count={coupons.used.length}
            label="사용 완료"
            onClick={() => setActiveTab('used')}
          />
        </div>

        <section className="point_shop_coupons_section">
          <div className="point_shop_coupons_list point_shop_coupons_shell">
            {activeCoupons.map((coupon) => {
              const isUsed = activeTab === 'used'

              return (
                <article
                  className={`point_shop_coupon_card${isUsed ? ' point_shop_coupon_card_used' : ''}`}
                  key={coupon.id}
                >
                  <div className="point_shop_coupon_card_box">
                    <div className="point_shop_coupon_media">
                      <img className="point_shop_coupon_media_image" src={coupon.imageSrc} alt={coupon.imageAlt} />
                    </div>
                    <div className="point_shop_coupon_information">
                      <div className="point_shop_coupon_title_wrap">
                        <p className="point_shop_coupon_title">
                          {coupon.titleLines.map((line) => (
                            <span key={line}>{line}</span>
                          ))}
                        </p>
                        <p className="point_shop_coupon_validity">{coupon.validity}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    className={`point_shop_coupon_action${isUsed ? ' point_shop_coupon_action_used' : ''}`}
                    disabled={isUsed}
                    type="button"
                  >
                    {coupon.actionLabel}
                  </button>
                </article>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
